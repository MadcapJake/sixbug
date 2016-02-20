use v6;
use HTTP::Server::Simple::PSGI;

sub NotFound {
  [ ~404, [ 'Content-Type' => 'text/plain' ],
          [ 'Not Found' ] ]
}

my $app = sub (%env) {
  given %env<REQUEST_URI>.split('?')[0] {
    when '/' {
      [ ~200, [ 'Content-Type' => 'text/html' ],
              [ slurp('public/index.html') ] ]
    }
    when '/tickets' {
      my $subject = %env<QUERY_STRING>.split('&')[0].split('=')[1];
      my $req = Proc::Async.new('rt', 'ls',
        '-f', 'id,subject,created', '-o', '-id',
        "(Status = 'new' OR Status = 'open' OR Status = 'stalled')" ~
        " AND (Subject LIKE '$subject')");
      my $output; $req.stdout.tap(-> $_ { $output ~= $_ });
      await $req.start;
      note $output;
      [ ~200, [ 'Content-Type' => 'application/json' ],
              [ '[' ~ $output.lines[1..* - 2].map({
                  my ($id, $subject, $created) =
                    $_.split("\t").map({ .trans(['"'] => ['\"']) });
                  "\{\"id\":\"$id\",\"subject\":\"$subject\",\"created\":\"$created\"\}";
                }).join(',') ~ ']' ] ]
    }
    when m[\/public\/(\w+\.\w+)] {
      return NotFound unless "public/$0".IO.e;
      [ ~200, [ 'Content-Type' => 'application/javascript' ],
              [ slurp("public/$0") ] ]
    }
    default { NotFound }
  }
}

my HTTP::Server::Simple::PSGI $server .= new(8080);
$server.host = 'localhost';
$server.app($app);
$server.run;

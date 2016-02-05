use v6;
use HTTP::Server::Simple::PSGI;
use JSON::Fast;

my $app = sub (%env) {
  given %env<REQUEST_URI>.split('?')[0] {
    when $_ ~~ '/' {
      return [
        '200',
        [ 'Content-Type' => 'text/html' ],
        [ slurp('form.html') ]
      ]
    }
    when $_ ~~ '/tickets' {
      my $subject = %env<QUERY_STRING>.split('&')[0].split('=')[1];
      my $req = Proc::Async.new('rt', 'ls',
        '-f', 'id,subject,created', '-o', '-id',
        "(Status = 'new' OR Status = 'open' OR Status = 'stalled')" ~
        " AND (Subject LIKE '$subject')");
      my $output; $req.stdout.tap(-> $_ { $output = $_ });
      await $req.start;
      say $output;
      return [
        '200',
        [ 'Content-Type' => 'application/json' ],
        [
          '[' ~ $output.split("\n")[1..* - 2].map({
            my ($id, $subject, $created) =
              $_.split("\t").map({ .trans(['"'] => ['\"']) });
            "\{\"id\":\"$id\",\"subject\":\"$subject\",\"created\":\"$created\"\}";
          }).join(',') ~ ']';
        ]
      ]
    }
    default {
      return [ '404', [ 'Content-Type' => 'text/plain' ], 'Not Found' ]
    }
  }
}

my HTTP::Server::Simple::PSGI $server .= new(8080);
$server.host = 'localhost';
$server.app($app);
$server.run;

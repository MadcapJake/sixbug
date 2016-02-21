use v6;
use HTTP::Server::Async;

my HTTP::Server::Async $server .= new :port(8080) :host<localhost>;

$server.handler: -> $req, $res {
  when $req.uri ~~ '/' {
    $res.headers<Content-Type> = 'text/html';
    $res.write: slurp('public/index.html');
    $res.close;
  }
  default { True }
}

$server.handler: -> $req, $res {
  when $req.uri ~~ '/tickets' {
    $res.headers<Content-Type> = 'application/json';
    $res.status = 200;
    $res.write: slurp('public/tickets.json');
    $res.close;
  }
  default { True }
}

$server.handler: -> $req, $res {
  when $req.uri ~~ rx|\/public\/(\w+)\.(\w+)| {
    given $1 {
      when 'js'  { $res.headers<Content-Type> = 'application/javascript' }
      when 'css' { $res.headers<Content-Type> = 'text/css' }
      default    { $res.headers<Content-Type> = 'text/plain' }
    }
    with slurp("public/$0.$1") { $res.status = 200; $res.write: $_ }
    else { $res.status = 404; $res.write: 'Not Found' }
    $res.close;
  }
  # default { True }
}

$server.listen: True;

=finish
react {
  whenever Supply.interval(30) {
    note "Writing to public/tickets.json at {DateTime.now}";
    my $req = Proc::Async.new('rt', 'ls',
      '-f', 'id,subject,created', '-o', '-id',
      "(Status = 'new' OR Status = 'open' OR Status = 'stalled')");
    my $output; $req.stdout.tap(-> $_ { $output ~= $_ });
    await $req.start;
    spurt 'public/tickets.json',
          "[\n" ~ $output.lines[1..* - 2].map({
            my ($id, $subject, $created) = $_.split("\t").map({ .trans(['"'] => ['\"']) });
            "\t\{\"id\":\"$id\",\"subject\":\"$subject\",\"created\":\"$created\"\}";
          }).join(",\n") ~ "\n]";
  }
}

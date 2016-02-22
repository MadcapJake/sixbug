use v6;
use HTTP::Server::Simple::PSGI;

sub NotFound {
  [ ~404, [ 'Content-Type' => 'text/plain' ],
          [ 'Not Found' ] ]
}

my %content = 'js' => 'application/javascript', 'css' => 'text/css';

my $app = sub (%env) {
  given %env<REQUEST_URI>.split('?')[0] {
    when '/' {
      [ ~200, [ 'Content-Type' => 'text/html' ],
              [ slurp('public/index.html') ] ]
    }
    when '/tickets' {
      [ ~200, [ 'Content-Type' => 'application/json' ],
              [ slurp('public/tickets.json') ] ]
    }
    when m[\/public\/(\w+)\.(\w+)] {
      return NotFound unless "public/$0.$1".IO.e;
      [ ~200, [ 'Content-Type' => %content{$1} ],
              [ slurp("public/$0.$1") ] ]
    }
    default { NotFound }
  }
}

my HTTP::Server::Simple::PSGI $server .= new(8080);
$server.host = 'localhost';
$server.app($app);
$server.run;

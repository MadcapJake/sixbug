use v6;
use HTTP::Server::Simple::PSGI;
use JSON::Fast;

my $app = sub (%env) {
  say %env<REQUEST_URI>;
  given %env<REQUEST_URI>.split('?')[0] {
    when $_ ~~ '/' {
      return [
        '200',
        [ 'Content-Type' => 'text/html' ],
        [ slurp('form.html') ]
      ]
    }
    when $_ ~~ '/tickets' {
      return [
        '200',
        [ 'Content-Type' => 'application/json' ],
        [
          (to-json [
            {
              id      => 127454,
              subject => 'parameter bug',
              created => '41 hours ago'
            },
            {
              id      => 127440,
              subject => 'Segmentation Fault with Crust',
              created => '4 days ago'
            }
          ])
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

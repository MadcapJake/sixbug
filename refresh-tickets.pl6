use v6;

use Net::Curl::NativeCall;

constant RTURL = 'https://rt.perl.org/REST/1.0/';

my Hash @tickets;

with curl_easy_init() {
  my Str $body;
  my $login = "user=perl6bug\@gmail.com\&pass={%*ENV<SIXBUG_RT_PW>}";
  curl_easy_setopt($_, CURLOPT_URL, "{RTURL}search/ticket?query=Queue='perl6'");
  curl_easy_setopt($_, CURLOPT_COPYPOSTFIELDS, $login);
  curl_easy_setopt($_, CURLOPT_WRITEDATA, $body);
  my $res = curl_easy_perform($_);
  if $res != CURLE_OK {
    warn sprintf("curl_easy_perform failed: %s\n", curl_easy_strerror($res))
  } else {
    @tickets = gather {
      for ($body.lines[1..*]».split(': ', 2)).grep(* == 2)
      -> @ ($i, $s) { take { id => $i, subject => $s } }
    }
  }
  curl_easy_cleanup($_)
} else { warn "curl failed to initialize" }


=finish
say "Refreshing tickets...";
my $req = Proc::Async.new('rt', 'ls',
  '-f', 'id,subject,created', '-o', '-id',
  "(Status = 'new' OR Status = 'open' OR Status = 'stalled')");
my $output; $req.stdout.tap(-> $_ { $output ~= $_ });
await $req.start;
spurt 'static/tickets.json',
  "[\n" ~ $output.lines[1..* - 2].map({
      my ($id, $subject, $created) =
        $_.split("\t").map({ .trans(['"', '\\'] => ['\"', '\\\\']) });
      "  \{\"id\":\"$id\",\"subject\":\"$subject\",\"created\":\"$created\"\}";
    }).join(",\n") ~ "\n]";
say 'Tickets refreshed!';

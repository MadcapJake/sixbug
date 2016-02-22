use v6;
say "Refreshing tickets...";
my $req = Proc::Async.new('rt', 'ls',
  '-f', 'id,subject,created', '-o', '-id',
  "(Status = 'new' OR Status = 'open' OR Status = 'stalled')");
my $output; $req.stdout.tap(-> $_ { $output ~= $_ });
await $req.start;
spurt 'public/tickets.json',
  "[\n" ~ $output.lines[1..* - 2].map({
      my ($id, $subject, $created) =
        $_.split("\t").map({ .trans(['"', '\\'] => ['\"', '\\\\']) });
      "  \{\"id\":\"$id\",\"subject\":\"$subject\",\"created\":\"$created\"\}";
    }).join(",\n") ~ "\n]";
say 'Tickets refreshed!';

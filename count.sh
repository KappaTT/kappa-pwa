( find ./src -name '*.ts*' -print0 | xargs -0 cat ) | wc -l
( find ./libs -name '*.*s*' -print0 | xargs -0 cat ) | wc -l
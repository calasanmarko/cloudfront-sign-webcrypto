DEFAULT_BENCH_RUNTIMES=(node)

echo "Choose which runtimes to benchmark by passing them as arguments to this script."
if [ $# -eq 0 ]; then
  echo "No runtimes specified. Defaulting to: ${DEFAULT_BENCH_RUNTIMES[@]}"
  FINAL_BENCH_RUNTIMES=("${DEFAULT_BENCH_RUNTIMES[@]}")
else
  FINAL_BENCH_RUNTIMES=("$@")
fi

HYPERFINE_COMMANDS=()

for runner in "${FINAL_BENCH_RUNTIMES[@]}"; do
  HYPERFINE_COMMANDS+=(
    "$runner ./src/run.js aws-cloudfront-sign"
    "$runner ./src/run.js cloudfront-sign-webcrypto"
    "$runner ./src/run.js cloudfront-sign-webcrypto --cache"
    "$runner ./src/run.js cloudfront-sign-webcrypto --parallel"
    "$runner ./src/run.js cloudfront-sign-webcrypto --parallel --cache"
  )
done


echo "Running benchmark for runtimes: ${FINAL_BENCH_RUNTIMES[@]}"
echo "====================================================="
echo ""

hyperfine --warmup 5 "${HYPERFINE_COMMANDS[@]}"
# this is mostly for CI, but if the .env file isn't there, create it from .env.example
if [[ ! -f ".env" ]]; then
    echo "since there is no .env file, copying the .env.example to .env!"
    cp .env.example .env
fi

TEST_TYPE=integration $(npm bin)/jest "$@"
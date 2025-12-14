#!/bin/sh
# wait-for.sh

set -e

# Load environment variables from .env
if [ -f ../backend/.env ]; then
  export $(grep -v '^#' ../backend/.env | xargs)
fi

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -p 5432 -U "$DB_USER"; do
  echo "Waiting for postgres at $host..."
  sleep 2
done

exec $cmd

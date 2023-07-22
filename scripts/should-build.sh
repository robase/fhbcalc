#!/bin/bash
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "dev" || "$VERCEL_GIT_COMMIT_REF" == "main"  ]] ; then
    echo "✅ - Build can proceed"
    exit 1;
else
    echo "🛑 - Build only runs on dev or main"
    exit 0;
fi
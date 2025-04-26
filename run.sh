#!/bin/bash
docker run -d --env-file .env -p 6000:3000 --name frontend nmsteve/blockscout-frontend:v1.0-beta

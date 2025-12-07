FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
# Create a temp directory for install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Pre-Build / Source copy stage
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [Optional] Tests & Build
# ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# Final release image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src src
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/drizzle.config.ts .
COPY --from=prerelease /app/tsconfig.json .
# Copy migrations folder if it exists, or ensure drizzle kit can generate/migrate
# Assuming drizzle migrations are in 'drizzle' folder as per common practice, or user might need to adjust
COPY --from=prerelease /app/drizzle ./drizzle 

# Install drizzle-kit specifically for production migrations
RUN bun add drizzle-kit 

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Run as non-root user for security (optional but recommended)
# USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["docker-entrypoint.sh"]

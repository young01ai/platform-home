FROM node:20

WORKDIR /app

RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# Files required by pnpm install
# COPY .npmrc package.json pnpm-lock.yaml .pnpmfile.cjs ./
COPY package.json pnpm-lock.yaml ./

# If you patched any package, include patches before install too
# COPY patches patches

# RUN pnpm install --frozen-lockfile --prod
RUN pnpm install

# Bundle app source
COPY . .

EXPOSE 3000 7766 8080
CMD [ "pnpm", "run", "dev" ]

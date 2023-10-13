# Slugify

loopback4-slug ver 0.2.0

## Basic use

### Updating repository

Change your repository parent class from `DefaultCrudRepository` to `SlugRepositoryMixin()()`

```ts
// Old
export class UserRepository extends DefaultCrudRepository<
    User,
    typeof User.prototype.id,
    UserRelations
> {
    // ...
}

// New
import {SlugRepositoryMixin} from "loopback4-slug";

export class UserRepository extends SlugRepositoryMixin<
    User,
    UserRelations
>()<Constructor<DefaultCrudRepository<User, typeof Artist.prototype.id, UserRelations>>>(
    DefaultCrudRepository
) {
    // ...
}
```

### Use decorator

Easily use the `@slug` decorator to generate and populate model property.

```ts
import {Entity, model, property} from "@loopback/repository";
import {slug} from "loopback4-slug";

@model()
export class User extends Entity {
  @property({
    type: 'string',
    required: true
  })
  name: string

  @slug({
    field: 'name',
    options: {
      lower: true,
      strict: true
    }
  })
  slug: string
}
```
## Debug

To display debug messages from this package, you can use the next command:

```shell
DEBUG=loopback:slug npm run start
```

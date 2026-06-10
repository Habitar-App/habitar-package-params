# CLAUDE.md — habitar-package-params

**Pacote compartilhado `@habitar/params` — filtros de query padronizados da API.** Parseia os query params do padrão Habitar (`?query=price>100000;status=active&include=owner&sort=price:desc&search=...`) e converte para Prisma (`where`/`include`/`orderBy`). É o que dá às listagens dos serviços (realstate, customers, chat, marketplace...) uma sintaxe de filtro única. **Zero dependências de runtime.**

## Stack & publicação

- TypeScript puro, bundle com **bunchee**. Publicado no **GitHub Packages** como `@habitar/params`.

## Comandos

```bash
bun install
bun run build      # bunchee
```

## Exports (src/index.ts)

**Parsers Habitar** (agnósticos de ORM — validam contra whitelist `validFields` e reportam erro via callback):
- `queryParamParser(errorCb, queryString, validFields, fieldsConfigs?)` → `QueryParamsType[]`
- `includeParamParser(errorCb, param, validFields)` → `string[]`
- `sortParamParser(errorCb, param, validFields)` → `{ field: "asc"|"desc" }` (suporta aninhado `owner.name:asc`)

**Conversores Prisma**:
- `prismaQueryParser(params, options?)` → objeto `where`
- `prismaIncludeParamParser(includes)` → objeto `include` aninhado
- `prismaSearchParamParser(search, validFields, opts?)` → `{ OR: [contains insensitive...] }` ou full-text (`{ search, params }` com `fullText: true`)

**Types**: `QueryParamOperators`, `QueryParamsType` (`[campo, operador, valor]`).

## Operadores do padrão de query

| Operador | Significado | Prisma |
| --- | --- | --- |
| `=` / `!=` | igual / diferente | `equals` / `not` |
| `>` `>=` `<` `<=` | comparação | `gt` `gte` `lt` `lte` |
| `~` | contém (substring) | `contains` |
| `@` | em lista `campo@[a,b]` | `in` |
| `><` | intervalo `campo><[min,max]` | `gte`+`lte` |

Extras: `fieldsConfigs` tipa/casta valores (number/boolean); `listRelations` nas options do Prisma parser usa `some/every/none` para relações 1:N.

## Estrutura

```
src/
  index.ts
  habitar/    # Include.ts, Query.ts, Sort.ts (parsers crus)
  prisma/     # Include.ts, Query.ts, Search.ts (conversores)
  types/      # QueryParamTypes.d.ts
  utils/      # splitByDots
```

## Gotchas

- A whitelist `validFields` é a defesa contra injection — **nunca** aceite campo fora dela.
- `sort` só aceita `asc`/`desc` minúsculos; `><` exige exatamente 2 valores.
- Erros são reportados pelo `errorCallback` (padrão dos serviços: lançar `AppError` 400) — não deixe exceções escaparem do parser.
- Mudou um operador? Atualize os serviços consumidores e a documentação de API junto.

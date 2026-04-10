# Salary Management Tool — Backend

A Rails API backend for managing employee data and salary insights for an organization of 10,000 employees.

## Tech Stack

- Ruby 3.4.7
- Rails 7.1 (API mode)
- PostgreSQL
- RSpec for testing

## Setup

```bash
# Install dependencies
bundle install

# Create and migrate the database
rails db:create db:migrate

# Seed 10,000 employees (idempotent — safe to re-run)
rails db:seed

# Run the server
PORT=3005 rails s
```

## Running Tests

```bash
bundle exec rspec
```

## API Endpoints

### Employees (CRUD)

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| GET    | /employees         | List employees (paginated)      |
| GET    | /employees/:id     | Get a single employee           |
| POST   | /employees         | Create an employee              |
| PUT    | /employees/:id     | Update an employee              |
| DELETE | /employees/:id     | Delete an employee              |

**Query params for GET /employees:**
- `page` — page number (default: 1)
- `per_page` — results per page (default: 20, max: 100)
- `country` — filter by country (case-insensitive)
- `job_title` — filter by job title (case-insensitive)
- `search` — search by full name (partial match)

### Salary Insights

| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | /insights/country/:country      | Salary stats for a country           |
| GET    | /insights/job_title?country=X&job_title=Y | Avg salary for role in country |
| GET    | /insights/top_roles             | Top 5 highest-paying roles           |

## Design Decisions

- **Service object pattern** — `SalaryInsightsService` encapsulates all analytics queries, keeping controllers thin.
- **Postgres PERCENTILE_CONT** — median salary is computed in SQL rather than loading all rows into Ruby memory.
- **Batch seeding** — `insert_all` in batches of 2,000 for fast, repeatable seeding.
- **Composite index** on `(country, job_title)` for the most common insights query path.
- **Country-specific salary ranges** in seeds for realistic data distribution.

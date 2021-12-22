# First Event Today

Track if it's the first time today that your users send any event.

## Important!

This plugin will only work on events ingested **after** the plugin was enabled. This means it **will** register events as being the first if there were events that occured **before** it was enabled. To mitigate this, you could consider renaming the relevant events and creating an [action](https://posthog.com/docs/features/actions) that matches both the old event name and the new one.

## Usage

This plugin will add the following two properties to events you specify:

- `first_today`
- `first_for_user_today`

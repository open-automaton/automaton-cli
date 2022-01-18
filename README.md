auto
====

The [Automaton](https://www.npmjs.com/package/@open-automaton/automaton) CLI

Actions
-------

### `auto fetch`
You want to scrape the *state* of the DOM once the page is loaded, but if you use a tool like `CURL` you'll only get the *transfer state* of the page, which is probably not useful. `auto fetch` pulls the state of the DOM out of a running browser and displays that HTML.

```bash
# fetch the full body of the form you are scraping and save it in page.hml
auto fetch https://domain.com/path/ > page.html
```
### `auto xpath`
The first thing you might do against the HTML you've captured is pull all the forms out of the page, like this:
```bash
# check the forms on the page
auto xpath "//form" page.html
```

Assuming you've identified the form name you are targeting as `my-form-name`, you then want to get all the inputs out of it with something like:

```bash
# select all the inputs you need to populate from this form:
auto xpath "//form[@name='my-form-name']//input|//form[@name='my-form-name']//select|//form[@name='my-form-name']//textarea" page.html
```

### `auto run`
From this you should be able to construct a primitive scrape definition(See the examples below for more concrete instruction). Once you have this definition you can do sample scrapes with:

```bash
TBD
```

## Plans
1. Migrate Basic Front-end Navigation using React-Router V6.4
    - Implement Login Components and Functionality
      - Authentication with Discord
      - Authentication Navigation
      - Login Form
    - Implement Dashboard Components and Functionality
      - `/` - displays a list of all webhooks and creates a webhook (GET, POST refers to /edit)
      - `/webhooks/:webhookId` - displays a specific webhook and updates it (GET,PUT refers to /edit)
      - `/webhooks/:webhookId/delete` - deletes a specific webhook (DELETE)
      - `/webhooks/:webhookId/edit` - edits a specific webhook (PUT)
      - Desired JSON to display should look like:
      ```json
      {
        "created_at": "date",
        "hook_url": "url",
        "house_type": ["array of house types (can be empty)"],
        "sublet": "true/false",
        "bedrooms": "number",
        "low_price_range": "number",
        "high_price_range": "number",
        "startDate": "date",
        "endDate": "date"
      
      }
      ```
         - `created_at` - DATE: Creation of webhook date
         - `hook_url` - STRING: Url string of the Discord Webhook. Cannot be null
         - `house_type` - ARRAY<STRING>: types of houses the posting details. If null, search for all types of housing
         - `sublet` - BOOLEAN: to determine if posting is a sublet (true/false). If null, search all postings regardless if sublet or not
         - `bedrooms` - NUMBER: number of bedrooms in posting. If null, search all postings with any number of bedrooms
         - `low_price_range` - NUMBER: Search for postings between `low_price_range` and `high_price_range`. If `high_price_range` is null, search for postings starting at `low_price_range` and higher 
         - `high_price_range` - NUMBER: Search for postings between `low_price_range` and `high_price_range`. If `low_price_range` is null, search for postings between $0 to `high_price_range`
         - `startDate` - DATE: Search for postings AVAILABLE between `startDate` and `endDate`. If `endDate` is null, search for postings between `startDate` and current date 
         - `endDate` - DATE: Search for postings AVAILABLE between `startDate` and `endDate`. If `startDate` is null, search for postings between current date and `endDate`
   - Use react-pro-sidebar library to implement sidebar

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode powered by Vite.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
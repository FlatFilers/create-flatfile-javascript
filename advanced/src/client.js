import { initializeFlatfile } from "@flatfile/javascript";
import { workbook } from "./workbook";

// Get this from your authenticated user in your application
const userId = "user4@example.com";
const server_url = "http://localhost:8080";

// Open existing space in modal
window.openFlatfile = ({ publishableKey, environmentId }) => {
  // Fetch userTable data from your mock API
  fetch(server_url + "/api/users")
    .then((response) => response.json())
    .then((userTable) => {
      // Check if the user exists in the userTable
      if (userTable[userId]) {
        const user = userTable[userId];
        const spaceId = user.spaceId;
        const companyId = user.companyId;

        if (spaceId) {
          // User exists in the table, proceed to get the accessToken
          fetch(server_url + "/space")
            .then((response) => response.json())
            .then((space) => {
              const accessToken = space && space.data && space.data.accessToken;

              // Initialize Flatfile with both spaceId and accessToken
              const flatfileOptions = {
                space: {
                  id: spaceId,
                  accessToken: accessToken,
                },
              };

              initializeFlatfile(flatfileOptions);
            })
            .catch((error) => {
              console.error("Error retrieving space in client:", error);
              // Handle error appropriately
            });
        } else {
          // spaceId is null, so include publishableKey and create a new space
          const flatfileOptions = {
            publishableKey,
            environmentId,
            workbook,
            spaceBody: {
              name: "New Space",
              namespace: "Red",
            },
            sidebarConfig: {
              showSidebar: true,
            },
            // Additional props...
          };

          // Fetch brandTable data from your mock API
          fetch(server_url + "/api/brands")
            .then((response) => response.json())
            .then((brandTable) => {
              // Check if companyId exists in brandTable and set the theme accordingly
              if (brandTable[companyId]) {
                const company = brandTable[companyId];
                const logo = company.logo;
                const name = company.name;
                const primaryColor = company.primaryColor;
                console.log(primaryColor);

                // Create the themeConfig based on primaryColor
                const theme = {
                  root: {
                    primaryColor: primaryColor,
                  },
                  sidebar: {
                    logo: logo,
                  },
                  // Additional theming options
                };

                // Add the theme to flatfileOptions
                flatfileOptions.name = name;
                flatfileOptions.themeConfig = theme;
              }

              initializeFlatfile(flatfileOptions);
              console.log(flatfileOptions);
            })
            .catch((error) => {
              console.error("Error retrieving brandTable in client:", error);
              // Handle error appropriately
            });
        }
      } else {
        // User not found in the userTable, handle this case
        console.error("User not found in userTable");
        // You can show an error message or take appropriate action here
      }
    })
    .catch((error) => {
      console.error("Error retrieving userTable in client:", error);
      // Handle error appropriately
    });
};

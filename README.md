# nlhweb
Platform Web NLH - UAT


# nlhweb Middleware

This middleware package serves as a bridge between the frontend application and the backend server for the "nlhweb" project. It provides a set of services to interact with various backend endpoints, ensuring type safety and efficient data handling.

## Installation

To install the middleware package, run the following command:

```bash
npm install nlhweb-middleware
```

## Usage

After installing the package, you can import the services in your frontend application as follows:

```typescript
import { UsersService, ManagersService, ProjectsService } from 'nlhweb-middleware';
```

### Example

Here’s a simple example of how to use the `UsersService` to fetch user details:

```typescript
const usersService = new UsersService();

usersService.getUserById(1).then(user => {
  console.log(user);
}).catch(error => {
  console.error('Error fetching user:', error);
});
```

## Services Overview

- **UsersService**: Interacts with user-related endpoints.
- **ManagersService**: Manages operations related to managers.
- **ProjectTypesService**: Handles project type data.
- **ProjectsService**: Manages project-related operations.
- **ProjectRelationsService**: Manages relationships between projects and professionals.
- **ProjectChargesService**: Handles project charge data.
- **ProjectConfigService**: Manages project configuration settings.
- **ProjectFilesService**: Manages project files.
- **QuestionsService**: Handles project-related questions.
- **ContactMessagesService**: Manages contact messages.
- **ProjectMembersService**: Manages project members.

## API Documentation

For detailed API documentation, please refer to the individual service files within the `src/services` directory.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
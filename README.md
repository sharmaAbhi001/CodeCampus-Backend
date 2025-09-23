# LeetLab
LeetLab is an online coding platform that allows users to solve coding problems in various programming languages. It provides a user-friendly interface for writing, testing, and submitting code solutions. The platform supports multiple languages, including Python, JavaScript, Java, C++, and more.
LeetLab integrates with the Judge0 API to compile and execute code submissions, providing real-time feedback on the results. Users can create accounts, track their progress, and participate in coding challenges.

## Features
- User authentication and profile management
- Problem listing with difficulty levels and tags
- Code editor with syntax highlighting and language selection
- Integration with Judge0 API for code execution
- Real-time feedback on code submissions    
- Admin panel for managing problems and users
- Responsive design for mobile and desktop use
## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- React.js
- Axios
- Judge0 API
- JWT for authentication

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>   
    cd leetlab
    ``` 
2. Install backend dependencies:
   ```bash  
   npm install
   ```
3. Set up the PostgreSQL database and configure the connection in the `.env` file.
4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the backend server:
   ```bash
    npm run dev
    ```
6. Navigate to the `client` directory and install frontend dependencies:
   ```bash
    cd client
    npm install
    ```
7. Start the frontend development server:
   ```bash
    npm start
    ``` 
8. Open your browser and go to `http://localhost:3000` to access the application.
## Environment Variables
Create a `.env` file in the root directory and add the following environment variables:
```
DATABASE_URL="your_postgresql_connection_string"
BASE_API_JUDGE0_URL="https://judge0-ce.p.rapidapi.com"
X_RAPID_API_KEY="your_rapidapi_key
```
## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the coding standards and include tests for new features or bug fixes.
## License
This project is licensed under the MIT License. See the LICENSE file for details.
## Acknowledgements
- [Judge0](https://judge0.com/) for providing the code execution API.
## Contact
For any questions or inquiries, please contact the project maintainer at [insanepanther97@gmail.com](mailto:insanepanther97@gmail.com)  

-note: Remember to replace `<repository-url>` with the actual URL of your repository and `your_postgresql_connection_string` and `your_rapidapi_key` with your actual database connection string and RapidAPI key, respectively.

-note: this web app is still under development and may contain bugs or incomplete features. Please report any issues you encounter on the GitHub repository.
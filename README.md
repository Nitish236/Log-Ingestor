<a name="readme-top"></a>

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Dyte Assignment</h3>

  <p align="center">
    <div>The assignment is to built Log Ingestor and a Query Interface</div>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Query Interface Screen Shot][product-screenshot]](#)

Project is Hosted here : [Project Link](https://log-q-interface.vercel.app/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

<div>
  <img src="https://cdn.rawgit.com/Nitish236/Nitish236/main/images/next-dot-js-svgrepo-com.svg" title="Next" alt="Next" width="40" height="40" />&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain-wordmark.svg" title="NodeJS" alt="NodeJS" width="40" height="40"/>&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg" title="MongoDB"  alt="MongoDB" width="40" height="40"/>&nbsp;
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Clone the Github Repo and follow these simple example steps.

Note :

1. I am not removing the .env files so no need to create another
2. The databse username and password are specifically generated for dyte databse only so the connection won't be able to access any other database.

### Prerequisites

npm is needed to run the software.

Run below code in your CMD or in VS code CMD

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

#### Backend Part

There are 3 methods to ingest logs

-- 1 st Method

1. cd into backend folder

```sh
  cd .\backend\
```

2. Install NPM packages

```sh
npm install
```

3. .envfile contains all the .env variable

```

# Database URL

// Use yours in the .env files

DB_URI = ""

# Frontend Domain
F_URL = "http://localhost:4000"

# Batch size for Ingesting
INGEST_BATCH_SIZE = 300

# Batch size for processing
PROCESSING_BATCH_SIZE = 150

# Secret for JWT
JWT_SECRET = "Dyte"

# Port number
PORT = 3000

```

4. Now run the below command to run the backend server and go to localhost:3000

```sh
npm run dev
```

5. Your backend server would be running on

```
http://localhost:3000
```

-- 2 nd Method

Be in the project directory

1. Using this method you will be running 3 servers and the load is distributed on basis of round robin so that every server recieves requests

2. I have not used dockerignore file so clear the nodemodules folder if you used 1st method. In CMD run the below command the docekr will take of all the things

```sh
docker-compose up --build -d
```

After this your backend server would be running on

```
http://localhost:3000
```

Note :-

1. For this to work you should have docker desktop on your laptop
2. [Docker Desktop](https://docs.docker.com/)

#### Frontend Part

While you are in the Project folder

1. cd into frontend folder

```sh
  cd .\frontend\
```

2. Install NPM packages
   ```sh
   npm install
   ```
3. next.config.js file contains all the .env variable

```
SERVER_URL: "http://localhost:3000"
```

4. Now run the below command to run the Query Interface and go to localhost:4000

```sh
npm run dev
```

5. Your Query Interface would be running on

```
http://localhost:4000
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Postman -->

## Postman

Postman Invite Link : [POSTMAN](https://www.postman.com/grey-escape-163414/workspace/dyte/collection/12272073-8bfd1fea-a9a5-48e3-8439-2716a5225c25?action=share&creator=12272073)

It is a public workspace that you can visit

<!-- Key Points -->

## Key Points

1. Using nginx helps to balance the trafiic to 3 different servers so helps in scalability.
2. Using docker helps to create multiple servers from a single image
3. The nginx server has capacity or buffer for approx 20 MB of data to receive, if want to send more data than change the capacity in the nginx.conf file in http

<!-- USAGE EXAMPLES -->

## Usage

Some video clip :

[Video Link](https://drive.google.com/drive/folders/14GM3fWcSknIApdq8tp4fEBnWgRWoFAIR?usp=sharing)

---- Frontend

You can use the Query Interface directly by going on the frontend URL.

1. In Query Interface, the message uses a index for text search others make uuse match field only

---- Backend

-- Ingest Logs

There are 3 methods

- 1st Method depends on the 1st method of the backend Installation

1. cd into backend folder

```sh
  cd .\backend\
```

2. Use this command to Ingest the sample.csv file replace the file as you need, see the header as they will be needed. Replace yyour file or give the file of your choice and its correct path.

3. The log ingestor will work only for 1st method of installation.

```sh
node log_ingestor ./utils/sample.csv
```

- 2nd Method can be used with any of the installation

1. Use the Postman and you will get the Post Request named as "Using File Ingest Logs" in AS/Logs Ingestor. For file you can use the sample.csv (contains 15000 records)

Route is :- "http://localhost:3000/file"

- 3rd Method can be used with any of the installation

1. Use the Postman and you will get the Post Request named as "Ingest Logs" in AS/Logs Ingestor. json body needs to sent (for this you can use the sample.js file if required)

Route is :- "http://localhost:3000/"

On an average it takes 2.5 sec to insert one batch of 150 documents in database when there were around 1 lakh records below is the image of records. (they will be deleted and only 15000 aprox will remain)

[![DB SS][db-ss]](#)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Nitish verma - [Github Profile](https://github.com/Nitish236)

--> The actual link where the project was made (Its private but will become public later on, so wait for 3-4 months)

Project Link : [Project](https://github.com/dyte-submissions/november-2023-hiring-Nitish236)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/nitver20/
[product-screenshot]: images/project.png
[db-ss]: images/db.png

Here’s a complete `README.md` file for the **server-side (Express + MongoDB + TypeScript)** of your Library Management System deployed via **Render**:

---

```markdown
# 📚 Library Management System - Server

This is the **backend server** for the Library Management System, built with:

- ⚙️ Node.js + Express
- 🗃️ MongoDB (Mongoose)
- ✍️ TypeScript
- 🔐 CORS-enabled API
- 🚀 Deployed on Render

---

## 🔥 Features

- 📖 CRUD operations for books
- 📊 Borrowing system with quantity tracking
- 📋 Borrow summary analytics
- 🌐 RESTful API with JSON responses
- ✅ Type safety with TypeScript

---

## 🛠️ Technologies Used

| Tech         | Description                     |
|--------------|---------------------------------|
| Node.js      | JavaScript runtime              |
| Express.js   | Web framework                   |
| MongoDB      | NoSQL database                  |
| Mongoose     | MongoDB ODM                     |
| TypeScript   | Static typing                   |
| Render       | Deployment platform             |

---

## 📁 Project Structure

```

src/
├── app/
│   └── controllers/      # Book/Borrow controllers
├── models/               # Mongoose schemas
├── server.ts             # Main server entry point
├── index.ts              # Render-compatible export
└── ...

````

---

## 🧑‍💻 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/library-server.git
cd library-server
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/library
```

### 4. Start in Development Mode

```bash
npm run dev
```

Visit: `http://localhost:5000`

---

## 🧱 API Endpoints

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/books`          | Get all books         |
| POST   | `/books`          | Create a new book     |
| PATCH  | `/books/:id`      | Update a book by ID   |
| DELETE | `/books/:id`      | Delete a book by ID   |
| POST   | `/borrow/:bookId` | Borrow a book         |
| GET    | `/borrow-summary` | Get borrowing summary |

---

## 📦 Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

---

## 🚀 Deployment on Render

### ✅ Render Settings

1. Go to [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Set:

   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
4. Add Environment Variables:

   * `MONGODB_URI`
   * `PORT` = 5000

### 🛠 Required Files

* `tsconfig.json`
* `package.json`
* `src/index.ts`:

```ts
import app from './server';
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---



## 🧪 Example Book Model

```ts
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  isbn: String,
  description: String,
  copies: Number,
  available: { type: Boolean, default: true }
});
```

---



import express, { Request, Response } from "express";
import session from "express-session";
import path from "path";
import { seedUsers, todoItems, addTodo, deleteTodo } from "./data/seed";
import { requireLogin } from "./middleware/requireLogin";

export const app = express();
const PORT = 3000;

/**  Step 1: Configure Express + EJS + Static files */
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), "public")));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

/**  Step 2: Configure session middleware (MemoryStore) */
// Session middleware (MemoryStore by default) — for learning/demo only
app.use(
  session({
    secret: "replace-with-a-strong-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      secure: true,
    },
  }),
);

// home page
app.get("/", (req: Request, res: Response) => {
  res.render("index", { error: undefined });
});

/**  Step 3: Implement login with seed users */
app.post("/login", (req: Request, res: Response) => {
  const username = (req.body.username ?? "").toString().trim();
  const password = (req.body.password ?? "").toString();
  const user = seedUsers.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) return res.redirect("/?q=invalid");
  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect("/todos");
});

/**  Step 5: Implement ToDo CRUD with seed data */
// ToDo list page (protected)
app.get("/todos", (req: Request, res: Response) => {
  const listTitle = "Today";
  const items = todoItems;
  const username = req.session.username;
  res.render("list", { items, listTitle, username });
});

// Add item (protected)
app.post("/add", (req: Request, res: Response) => {
  const name = (req.body.newItem ?? "").toString().trim();
  if (name) addTodo(name);
  res.redirect("/todos");
});

// Delete item (protected)
app.post("/delete", (req: Request, res: Response) => {
  const id = Number(req.body.checkbox);
  if (!Number.isNaN(id)) deleteTodo(id);
  res.redirect("/todos");
});

/** Step 6: Logout */
app.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect("/"));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

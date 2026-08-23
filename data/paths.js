/* Professor Dev Hub - Learning Paths Data */

const LEARNING_PATHS = [
  {
    id: 'html-fundamentals',
    title: 'HTML Fundamentals',
    icon: '📄',
    description: 'Master the building blocks of every web page.',
    color: '#e34c26',
    lessons: [
      {
        id: 'html-intro',
        title: 'Introduction to HTML',
        content: `
          <h3>What is HTML?</h3>
          <p>HTML (HyperText Markup Language) is the standard language for creating web pages. It describes the <strong>structure</strong> and <strong>content</strong> of a webpage using elements (tags).</p>
          <div class="highlight-box"><strong>Key Idea:</strong> HTML is not a programming language — it is a <em>markup</em> language.</div>
          <h3>Basic Document Structure</h3>
          <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;My First Page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello World!&lt;/h1&gt;
    &lt;p&gt;This is my first webpage.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
          <h3>Essential Tags</h3>
          <ul>
            <li><code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> — Headings</li>
            <li><code>&lt;p&gt;</code> — Paragraph</li>
            <li><code>&lt;a href="..."&gt;</code> — Link</li>
            <li><code>&lt;img src="..." alt="..."&gt;</code> — Image</li>
            <li><code>&lt;ul&gt;</code> / <code>&lt;ol&gt;</code> + <code>&lt;li&gt;</code> — Lists</li>
            <li><code>&lt;div&gt;</code> — Generic container</li>
            <li><code>&lt;span&gt;</code> — Inline container</li>
          </ul>
        `
      },
      {
        id: 'html-semantic',
        title: 'Semantic HTML',
        content: `
          <h3>Why Semantic HTML Matters</h3>
          <p>Semantic elements clearly describe their meaning to both the browser and the developer. They improve accessibility, SEO, and code readability.</p>
          <h3>Common Semantic Elements</h3>
          <ul>
            <li><code>&lt;header&gt;</code> — Introductory content / navigation</li>
            <li><code>&lt;nav&gt;</code> — Navigation links</li>
            <li><code>&lt;main&gt;</code> — Main content of the page</li>
            <li><code>&lt;section&gt;</code> — Thematic grouping of content</li>
            <li><code>&lt;article&gt;</code> — Independent, self-contained content</li>
            <li><code>&lt;aside&gt;</code> — Side content</li>
            <li><code>&lt;footer&gt;</code> — Footer information</li>
          </ul>
          <div class="highlight-box">Prefer semantic tags over generic <code>&lt;div&gt;</code> whenever possible.</div>
        `
      },
      {
        id: 'html-forms',
        title: 'Forms & Input',
        content: `
          <h3>Building Forms</h3>
          <p>Forms allow users to send data to a server.</p>
          <pre><code>&lt;form action="/submit" method="POST"&gt;
  &lt;label for="name"&gt;Name:&lt;/label&gt;
  &lt;input type="text" id="name" name="name" required&gt;
  &lt;label for="email"&gt;Email:&lt;/label&gt;
  &lt;input type="email" id="email" name="email" required&gt;
  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre>
          <h3>Useful Input Types</h3>
          <ul>
            <li><code>text</code>, <code>email</code>, <code>password</code>, <code>number</code></li>
            <li><code>checkbox</code>, <code>radio</code></li>
            <li><code>date</code>, <code>file</code>, <code>color</code></li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'css-basics',
    title: 'CSS Basics & Modern Layouts',
    icon: '🎨',
    description: 'Style and layout websites with modern CSS.',
    color: '#264de4',
    lessons: [
      {
        id: 'css-intro',
        title: 'Introduction to CSS',
        content: `
          <h3>What is CSS?</h3>
          <p>CSS (Cascading Style Sheets) controls the visual presentation of HTML.</p>
          <h3>Ways to Add CSS</h3>
          <ol>
            <li><strong>Inline</strong> — <code>style="color: red;"</code></li>
            <li><strong>Internal</strong> — <code>&lt;style&gt;</code> in the head</li>
            <li><strong>External</strong> — <code>&lt;link rel="stylesheet" href="styles.css"&gt;</code> (recommended)</li>
          </ol>
          <pre><code>h1 { color: navy; }
.card { padding: 1rem; }
#hero { background: #6366f1; }</code></pre>
        `
      },
      {
        id: 'css-box-model',
        title: 'The Box Model',
        content: `
          <h3>Understanding the Box Model</h3>
          <p>Every element is a box: Content → Padding → Border → Margin.</p>
          <pre><code>.box {
  width: 300px;
  padding: 20px;
  border: 2px solid #6366f1;
  margin: 16px;
  box-sizing: border-box;
}</code></pre>
          <div class="highlight-box">Always set <code>box-sizing: border-box;</code> globally.</div>
        `
      },
      {
        id: 'css-flexbox',
        title: 'Flexbox Layout',
        content: `
          <h3>Flexbox – One-Dimensional Layout</h3>
          <pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}</code></pre>
          <ul>
            <li><code>justify-content</code> — main axis</li>
            <li><code>align-items</code> — cross axis</li>
            <li><code>flex-direction</code> — row | column</li>
          </ul>
        `
      },
      {
        id: 'css-grid',
        title: 'CSS Grid',
        content: `
          <h3>CSS Grid – Two-Dimensional Layout</h3>
          <pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}</code></pre>
          <div class="highlight-box">Use Flexbox for components and Grid for page structure.</div>
        `
      }
    ]
  },
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals',
    icon: '🐍',
    description: 'Learn Python — clean syntax, powerful for APIs, automation & data.',
    color: '#3776ab',
    lessons: [
      {
        id: 'py-intro',
        title: 'Introduction to Python',
        content: `
          <h3>Why Python?</h3>
          <p>Python is readable, versatile, and widely used for web APIs, scripting, AI, and data science.</p>
          <pre><code># First program
print("Hello, Developer!")

# Variables (no type declaration needed)
name = "Ada"
age = 28
is_student = True</code></pre>
          <h3>Core Types</h3>
          <ul>
            <li><code>int</code>, <code>float</code> — numbers</li>
            <li><code>str</code> — text</li>
            <li><code>bool</code> — True / False</li>
            <li><code>list</code>, <code>dict</code>, <code>tuple</code>, <code>set</code></li>
          </ul>
        `
      },
      {
        id: 'py-control',
        title: 'Control Flow',
        content: `
          <h3>If / Elif / Else</h3>
          <pre><code>score = 85
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"</code></pre>
          <h3>Loops</h3>
          <pre><code># For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 3:
    print(count)
    count += 1</code></pre>
        `
      },
      {
        id: 'py-functions',
        title: 'Functions & Modules',
        content: `
          <h3>Defining Functions</h3>
          <pre><code>def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Moses"))
print(greet("Ada", "Hi"))</code></pre>
          <h3>Modules</h3>
          <pre><code>import math
from datetime import datetime

print(math.sqrt(16))
print(datetime.now())</code></pre>
          <div class="highlight-box">Use <code>if __name__ == "__main__":</code> to run code only when the file is executed directly.</div>
        `
      },
      {
        id: 'py-data',
        title: 'Lists, Dicts & JSON',
        content: `
          <h3>Lists & Dictionaries</h3>
          <pre><code>skills = ["HTML", "CSS", "Python"]
skills.append("APIs")

user = {
    "name": "Ada",
    "role": "developer",
    "active": True
}
print(user["name"])</code></pre>
          <h3>Working with JSON</h3>
          <pre><code>import json

data = {"id": 1, "title": "Lesson"}
text = json.dumps(data)      # to string
obj = json.loads(text)       # back to dict</code></pre>
        `
      }
    ]
  },
  {
    id: 'api-development',
    title: 'API Development',
    icon: '🔌',
    description: 'Build and consume REST APIs — the backbone of modern apps.',
    color: '#0ea5e9',
    lessons: [
      {
        id: 'api-intro',
        title: 'What is an API?',
        content: `
          <h3>API = Application Programming Interface</h3>
          <p>An API lets software talk to other software. On the web, we mostly use <strong>HTTP APIs</strong> (REST-style).</p>
          <div class="highlight-box">Client (browser / app) → HTTP request → Server → JSON response</div>
          <h3>Common HTTP Methods</h3>
          <ul>
            <li><code>GET</code> — read data</li>
            <li><code>POST</code> — create data</li>
            <li><code>PUT / PATCH</code> — update data</li>
            <li><code>DELETE</code> — remove data</li>
          </ul>
        `
      },
      {
        id: 'api-rest',
        title: 'REST Principles',
        content: `
          <h3>REST Basics</h3>
          <p>REST organizes APIs around <strong>resources</strong> (users, posts, products) identified by URLs.</p>
          <pre><code>GET    /api/users          → list users
GET    /api/users/42       → one user
POST   /api/users          → create user
PUT    /api/users/42       → replace user
PATCH  /api/users/42       → partial update
DELETE /api/users/42       → delete user</code></pre>
          <h3>Status Codes</h3>
          <ul>
            <li><code>200</code> OK · <code>201</code> Created</li>
            <li><code>400</code> Bad Request · <code>401</code> Unauthorized</li>
            <li><code>404</code> Not Found · <code>500</code> Server Error</li>
          </ul>
        `
      },
      {
        id: 'api-fetch',
        title: 'Consuming APIs with Fetch',
        content: `
          <h3>JavaScript Fetch API</h3>
          <pre><code>// GET request
const res = await fetch("https://api.example.com/users");
const users = await res.json();

// POST request
const res2 = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ada" })
});
const created = await res2.json();</code></pre>
          <div class="highlight-box">Always check <code>res.ok</code> or status before trusting the body.</div>
        `
      },
      {
        id: 'api-python',
        title: 'Simple API with Python (Flask)',
        content: `
          <h3>Minimal Flask API</h3>
          <pre><code>from flask import Flask, jsonify, request

app = Flask(__name__)

@app.get("/api/hello")
def hello():
    return jsonify({ "message": "Hello from API" })

@app.post("/api/users")
def create_user():
    data = request.get_json()
    return jsonify(data), 201

if __name__ == "__main__":
    app.run(debug=True)</code></pre>
          <p>Install with: <code>pip install flask</code></p>
        `
      }
    ]
  },
  {
    id: 'csharp-basics',
    title: 'C# Basics',
    icon: '💠',
    description: 'Get started with C# — strong typing, great for backends & apps.',
    color: '#68217a',
    lessons: [
      {
        id: 'cs-intro',
        title: 'Introduction to C#',
        content: `
          <h3>What is C#?</h3>
          <p>C# is a modern, object-oriented language from Microsoft. It powers .NET web APIs, desktop, mobile (MAUI), and games (Unity).</p>
          <pre><code>using System;

class Program {
  static void Main() {
    Console.WriteLine("Hello, C#!");
    string name = "Ada";
    int age = 28;
    bool active = true;
  }
}</code></pre>
        `
      },
      {
        id: 'cs-types',
        title: 'Types & Control Flow',
        content: `
          <h3>Common Types</h3>
          <ul>
            <li><code>int</code>, <code>double</code>, <code>bool</code>, <code>string</code></li>
            <li><code>var</code> — type inferred by compiler</li>
            <li><code>List&lt;T&gt;</code>, arrays</li>
          </ul>
          <pre><code>int score = 85;
if (score >= 90) {
  Console.WriteLine("A");
} else if (score >= 70) {
  Console.WriteLine("B");
} else {
  Console.WriteLine("C");
}

for (int i = 0; i < 5; i++) {
  Console.WriteLine(i);
}</code></pre>
        `
      },
      {
        id: 'cs-methods',
        title: 'Methods & Classes',
        content: `
          <h3>Methods</h3>
          <pre><code>static string Greet(string name, string greeting = "Hello") {
  return $"{greeting}, {name}!";
}</code></pre>
          <h3>Simple Class</h3>
          <pre><code>class User {
  public string Name { get; set; }
  public int Age { get; set; }

  public void Introduce() {
    Console.WriteLine($"I am {Name}, {Age} years old.");
  }
}</code></pre>
        `
      }
    ]
  }
];

window.LEARNING_PATHS = LEARNING_PATHS;

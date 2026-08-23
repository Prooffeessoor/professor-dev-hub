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
          
          <div class="highlight-box">
            <strong>Key Idea:</strong> HTML is not a programming language — it is a <em>markup</em> language.
          </div>

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
            <li><code>&lt;aside&gt;</code> — Side content (sidebar, callouts)</li>
            <li><code>&lt;footer&gt;</code> — Footer information</li>
            <li><code>&lt;figure&gt;</code> + <code>&lt;figcaption&gt;</code> — Images with captions</li>
          </ul>

          <div class="highlight-box">
            Prefer semantic tags over generic <code>&lt;div&gt;</code> whenever possible.
          </div>
        `
      },
      {
        id: 'html-forms',
        title: 'Forms & Input',
        content: `
          <h3>Building Forms</h3>
          <p>Forms allow users to send data to a server. They are essential for login, search, contact, and registration pages.</p>

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
            <li><code>submit</code>, <code>reset</code>, <code>button</code></li>
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
          <p>CSS (Cascading Style Sheets) controls the visual presentation of HTML. It separates content from design.</p>

          <h3>Ways to Add CSS</h3>
          <ol>
            <li><strong>Inline</strong> — <code>style="color: red;"</code></li>
            <li><strong>Internal</strong> — <code>&lt;style&gt;</code> tag in the <code>&lt;head&gt;</code></li>
            <li><strong>External</strong> — <code>&lt;link rel="stylesheet" href="styles.css"&gt;</code> (recommended)</li>
          </ol>

          <h3>Selectors</h3>
          <pre><code>/* Element */
h1 { color: navy; }

/* Class */
.card { padding: 1rem; }

/* ID */
#hero { background: #6366f1; }

/* Descendant */
nav a { text-decoration: none; }</code></pre>
        `
      },
      {
        id: 'css-box-model',
        title: 'The Box Model',
        content: `
          <h3>Understanding the Box Model</h3>
          <p>Every HTML element is a rectangular box made of:</p>
          <ul>
            <li><strong>Content</strong> — the actual text/image</li>
            <li><strong>Padding</strong> — space inside the border</li>
            <li><strong>Border</strong> — the edge around the padding</li>
            <li><strong>Margin</strong> — space outside the border</li>
          </ul>

          <pre><code>.box {
  width: 300px;
  padding: 20px;
  border: 2px solid #6366f1;
  margin: 16px;
  box-sizing: border-box; /* recommended */
}</code></pre>

          <div class="highlight-box">
            Always set <code>box-sizing: border-box;</code> globally for predictable layouts.
          </div>
        `
      },
      {
        id: 'css-flexbox',
        title: 'Flexbox Layout',
        content: `
          <h3>Flexbox – One-Dimensional Layout</h3>
          <p>Flexbox makes it easy to align and distribute space among items in a container.</p>

          <pre><code>.container {
  display: flex;
  justify-content: space-between; /* main axis */
  align-items: center;            /* cross axis */
  gap: 1rem;
}

.item {
  flex: 1; /* grow equally */
}</code></pre>

          <h3>Common Properties</h3>
          <ul>
            <li><code>justify-content</code>: flex-start | center | space-between | space-around</li>
            <li><code>align-items</code>: stretch | center | flex-start | flex-end</li>
            <li><code>flex-direction</code>: row | column</li>
            <li><code>flex-wrap</code>: nowrap | wrap</li>
          </ul>
        `
      },
      {
        id: 'css-grid',
        title: 'CSS Grid',
        content: `
          <h3>CSS Grid – Two-Dimensional Layout</h3>
          <p>Grid is perfect for complex page layouts (rows + columns).</p>

          <pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.header { grid-column: 1 / -1; }
.sidebar { grid-row: span 2; }</code></pre>

          <div class="highlight-box">
            Use Flexbox for components and Grid for overall page structure.
          </div>
        `
      }
    ]
  }
];

// Make available globally
window.LEARNING_PATHS = LEARNING_PATHS;

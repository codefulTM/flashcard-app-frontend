# CSS Variables Reference

## 📚 Available CSS Variables

Hệ thống theme của chúng ta cung cấp các CSS variables sau, tự động cập nhật khi user thay đổi theme hoặc mode:

### 🎨 Primary Colors (Theme-specific)

```css
--primary-start: /* Màu bắt đầu của gradient */
--primary-mid: /* Màu giữa của gradient */
--primary-end: /* Màu kết thúc của gradient */
```

**Ví dụ sử dụng:**

```css
.gradient-button {
  background: linear-gradient(
    135deg,
    var(--primary-start),
    var(--primary-mid),
    var(--primary-end)
  );
}

.primary-text {
  color: var(--primary-start);
}
```

---

### 🌓 Background & Foreground (Mode-specific)

```css
--background: /* Màu nền chính */
--foreground: /* Màu text chính */
```

**Light Mode:** `#fafbfc` / `#0f172a`  
**Dark Mode:** `#0a0f1e` / `#f1f5f9`

**Ví dụ sử dụng:**

```css
body {
  background: var(--background);
  color: var(--foreground);
}
```

---

### 🃏 Card Colors (Mode-specific)

```css
--card-bg: /* Background cho cards */
--card-border: /* Border color cho cards */
```

**Ví dụ sử dụng:**

```css
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
}
```

---

### ✨ Glassmorphism (Mode-specific)

```css
--glass-bg: /* Background với transparency */
--glass-border: /* Border với transparency */
--glass-shadow: /* Shadow cho glass effect */
```

**Ví dụ sử dụng:**

```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}
```

---

### 📝 Text Colors (Mode-specific)

```css
--text-primary: /* Text chính */
--text-secondary: /* Text phụ */
--text-tertiary: /* Text nhạt nhất */
```

**Light Mode:** `#0f172a` / `#475569` / `#64748b`  
**Dark Mode:** `#f1f5f9` / `#cbd5e1` / `#94a3b8`

**Ví dụ sử dụng:**

```css
h1 {
  color: var(--text-primary);
}

p {
  color: var(--text-secondary);
}

.caption {
  color: var(--text-tertiary);
}
```

---

### 🎭 Shadows (Mode-specific)

```css
--shadow-sm: /* Shadow nhỏ */
--shadow-md: /* Shadow vừa */
--shadow-lg: /* Shadow lớn */
--shadow-xl: /* Shadow rất lớn */
--shadow-glow: /* Glow effect */
```

**Ví dụ sử dụng:**

```css
.card {
  box-shadow: var(--shadow-md);
}

.card:hover {
  box-shadow: var(--shadow-xl), var(--shadow-glow);
}
```

---

### ✅ Semantic Colors

```css
--success: #10b981 /* Green */
--warning: #f59e0b /* Amber */
--error: #ef4444 /* Red */
--info: #3b82f6 /* Blue */
```

**Ví dụ sử dụng:**

```css
.success-message {
  background: var(--success);
  color: white;
}

.error-message {
  background: var(--error);
  color: white;
}
```

---

### 🌈 Accent Colors

```css
--accent-blue: #3b82f6
--accent-purple: #a855f7
--accent-pink: #ec4899
--accent-cyan: #06b6d4
--accent-emerald: #10b981
```

**Ví dụ sử dụng:**

```css
.badge-blue {
  background: var(--accent-blue);
}

.badge-purple {
  background: var(--accent-purple);
}
```

---

## 🎯 Best Practices

### 1. **Sử dụng CSS Variables thay vì hardcode colors**

❌ **Không nên:**

```css
.button {
  background: #6366f1;
  color: #ffffff;
}
```

✅ **Nên:**

```css
.button {
  background: var(--primary-start);
  color: white;
}
```

### 2. **Kết hợp với Tailwind dark: prefix**

```tsx
<div className="bg-white dark:bg-gray-900">
  {/* Hoặc */}
  <div style={{ background: 'var(--card-bg)' }}>
```

### 3. **Tạo gradient với primary colors**

```css
.gradient-bg {
  background: linear-gradient(
    135deg,
    var(--primary-start),
    var(--primary-mid),
    var(--primary-end)
  );
}
```

### 4. **Responsive shadows**

```css
.card {
  box-shadow: var(--shadow-sm);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.card:active {
  box-shadow: var(--shadow-md);
}
```

---

## 🔄 Dynamic Updates

Tất cả CSS variables sẽ tự động cập nhật khi:

- User thay đổi theme color (Indigo, Rose, Emerald, etc.)
- User thay đổi mode (Light, Dark, System)
- System preference thay đổi (khi mode = System)

**Không cần reload page!** ✨

---

## 💡 Examples

### Example 1: Custom Card Component

```tsx
export function CustomCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(10px)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow)",
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      {children}
    </div>
  );
}
```

### Example 2: Gradient Text

```tsx
export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background: `linear-gradient(135deg, var(--primary-start), var(--primary-mid), var(--primary-end))`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}
```

### Example 3: Status Badge

```tsx
export function StatusBadge({
  status,
}: {
  status: "success" | "warning" | "error" | "info";
}) {
  return (
    <span
      style={{
        background: `var(--${status})`,
        color: "white",
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        fontSize: "0.875rem",
        fontWeight: "600",
      }}
    >
      {status}
    </span>
  );
}
```

---

## 🎨 Theme Color Values

| Theme   | Start     | Mid       | End       |
| ------- | --------- | --------- | --------- |
| Indigo  | `#6366f1` | `#8b5cf6` | `#d946ef` |
| Rose    | `#f43f5e` | `#ec4899` | `#f97316` |
| Emerald | `#10b981` | `#14b8a6` | `#06b6d4` |
| Amber   | `#f59e0b` | `#f97316` | `#ef4444` |
| Cyan    | `#06b6d4` | `#3b82f6` | `#8b5cf6` |
| Violet  | `#8b5cf6` | `#a855f7` | `#d946ef` |

---

## 📖 Additional Resources

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Using CSS Variables (CSS-Tricks)](https://css-tricks.com/a-complete-guide-to-custom-properties/)

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h1>Hello World</h1>
        <p>This is a test</p>
        <Button variant="secondary" size="lg">
          Click me
        </Button>
        <Button variant="ghost" size="sm">
          Click me
        </Button>
        <Button variant="destructive" size="lg">
          Click me
        </Button>
      </div>
    </div>
  );
}

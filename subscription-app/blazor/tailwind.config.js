module.exports = {
    content: [
        "./BlazorApp/**/*.{razor,html,cshtml}",
        "./BlazorApp/wwwroot/**/*.{css,js}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4F46E5",
                background: "#F9FAFB",
                text: "#111827",
                success: "#10B981",
                danger: "#EF4444"
            }
        }
    },
    plugins: []
};

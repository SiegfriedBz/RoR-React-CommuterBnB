export const formatedDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}
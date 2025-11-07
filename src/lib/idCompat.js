export default function idCompat(id = "") {
    if (id.length == 24) {
        // Legacy MongoDB ID
        return { mongo_id: id }
    } else if (id.length == 36) {
        return { id: id }
    } else {
        throw new Error("ID_COMPAT: Unexpected ID " + id);
    }
}
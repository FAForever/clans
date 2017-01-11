export default {
    formatTimestamp(timestamp) {
        let d = timestamp != null ? new Date(timestamp) : new Date();
        return d.toISOString().slice(0, 10);
    }
};
let toastContainerRef = null;

export default {
    setToast(toastRef) {
        toastContainerRef = toastRef;
    },
    getContainer() {
        return toastContainerRef;
    }
};


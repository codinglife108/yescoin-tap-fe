import React, {Component} from "react";
import Placeholder from "./Placeholder/Placeholder";

class ErrorBoundary extends Component {

    state = {
        error: null,
    };

    static getDerivedStateFromError(error: any) {
        return { error };
    }

    render() {
        const { error } = this.state as any;

        if (error) {
            //import("../eruda").then(({ default: eruda }) => {});
            console.error(error);

            return (
                <div style={{ textAlign: "center", paddingTop: "15vh" }}>
                    <Placeholder title="App crash, reload this page" />
                </div>
            );
        }

        return (this.props as any).children;
    }
}

export default ErrorBoundary;
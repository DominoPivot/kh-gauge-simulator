import type { PropsWithChildren } from "react";
import "./InformationBar.css";

export function InformationBar ({ children }: PropsWithChildren) {
    return (
        <div className="InformationBar">
            <div className="InformationBar__heading">INFORMATION</div>
            <div className="InformationBar__message">{children}</div>
        </div>
    );
}

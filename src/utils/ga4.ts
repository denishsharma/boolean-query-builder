import ReactGA from "react-ga4";

export function trackSocialLinkClick(socialPlatform: string) {
    ReactGA.event({
        category: "Social",
        action: "Click",
        label: socialPlatform,
    });
}

export function trackExportSchemaClick() {
    ReactGA.event({
        category: "Query Builder",
        action: "Export Schema",
    });
}

export function trackImportSchemaClick() {
    ReactGA.event({
        category: "Query Builder",
        action: "Import Schema",
    });
}

export function trackLogInternalStructureClick() {
    ReactGA.event({
        category: "Query Builder",
        action: "Log Internal Structure",
    });
}

import { extendTheme, theme as base, withDefaultColorScheme } from "@chakra-ui/react";

const fonts = {
    heading: `Montserrat, ${base.fonts?.heading}`,
    body: `Inter, ${base.fonts?.body}`,
};

export default fonts;

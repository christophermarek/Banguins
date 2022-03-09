import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import colors from "./colors";
import fonts from "./fonts";

const theme = extendTheme(
    {
        colors,
        fonts,
    },
    withDefaultColorScheme({
        colorScheme: "tangaroa",
        components: ["Button"],
    })
);

export default theme;

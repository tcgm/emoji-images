import { Box, Select, Button } from "@chakra-ui/react";
import * as faIcons from "react-icons/fa";
import * as mdIcons from "react-icons/md";
import * as giIcons from "react-icons/gi";
import * as aiIcons from "react-icons/ai";
import * as ioIcons from "react-icons/io";
import * as tiIcons from "react-icons/ti";
import * as goIcons from "react-icons/go";
import * as fiIcons from "react-icons/fi";
import * as bsIcons from "react-icons/bs";
import * as riIcons from "react-icons/ri";
import * as cgIcons from "react-icons/cg";
import * as biIcons from "react-icons/bi";
import * as siIcons from "react-icons/si";
import React from "react";

const iconSets = [
    { name: "FontAwesome", icons: faIcons },
    { name: "Material", icons: mdIcons },
    { name: "GameIcons", icons: giIcons },
    { name: "AntDesign", icons: aiIcons },
    { name: "Ionicons", icons: ioIcons },
    { name: "Typicons", icons: tiIcons },
    { name: "GithubOcticons", icons: goIcons },
    { name: "Feather", icons: fiIcons },
    { name: "Bootstrap", icons: bsIcons },
    { name: "Remix", icons: riIcons },
    { name: "CoreUI", icons: cgIcons },
    { name: "BoxIcons", icons: biIcons },
    { name: "SimpleIcons", icons: siIcons },
];

export default function ReactIconTest() {
    const [setIdx, setSetIdx] = React.useState(0);
    const [iconName, setIconName] = React.useState<string>("");
    const currentSet = iconSets[setIdx];
    const iconKeys = Object.keys(currentSet.icons).filter(k => typeof (currentSet.icons as any)[k] === "function");
    const IconComponent = iconName && (currentSet.icons as any)[iconName];

    React.useEffect(() => {
        setIconName(iconKeys[0]);
    }, [setIdx]);

    return (
        <Box p={8} fontSize={64} color="orange.400">
            <Box mb={4}>
                <Select value={setIdx} onChange={e => setSetIdx(Number(e.target.value))} w="200px" mb={2}>
                    {iconSets.map((set, i) => (
                        <option key={set.name} value={i}>{set.name}</option>
                    ))}
                </Select>
                <Select value={iconName} onChange={e => setIconName(e.target.value)} w="300px">
                    {iconKeys.map(k => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </Select>
            </Box>
            <Box>
                {IconComponent ? <IconComponent /> : <span>No icon</span>}
            </Box>
        </Box>
    );
}

import { Box, Card, CardBody, Heading, Text, useColorModeValue } from "@chakra-ui/react";

type Props = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    version?: string;
    date?: string;
    sequencesCount?: number;
    supplementCount?: number;
    totalCount?: number;
    canvasSize?: number;
};

export default function PreviewCard({
    canvasRef,
    version,
    date,
    sequencesCount,
    supplementCount,
    totalCount,
    canvasSize = 64
}: Props) {
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("#e2e8f0", "#2d3748");
    const infoColor = useColorModeValue("gray.600", "gray.300");
    return (
        <Card w="240px" bg={cardBg}>
            <CardBody>
                <canvas ref={canvasRef} style={{ width: canvasSize, height: canvasSize, borderRadius: 8, border: `1px solid ${borderColor}` }} />
                <Heading size="sm" mt={2} mb={1}>Emoji Info</Heading>
                <Box fontSize="sm" color={infoColor}>
                    <Text>Version: <b>{version ?? "-"}</b></Text>
                    <Text>Date: <b>{date ?? "-"}</b></Text>
                    <Text>Sequences: <b>{sequencesCount ?? 0}</b></Text>
                    <Text>Supplement: <b>{supplementCount ?? 0}</b></Text>
                    <Text>Total: <b>{totalCount ?? 0}</b></Text>
                </Box>
            </CardBody>
        </Card>
    );
}

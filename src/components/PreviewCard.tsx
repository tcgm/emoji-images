import { Box, Card, CardBody, Heading, Text } from "@chakra-ui/react";

type Props = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    version?: string;
    date?: string;
    sequencesCount?: number;
    supplementCount?: number;
    totalCount?: number;
};

export default function PreviewCard({
    canvasRef, version, date, sequencesCount, supplementCount, totalCount
}: Props) {
    return (
        <Card w="240px">
            <CardBody>
                <canvas ref={canvasRef} style={{ width: 200, height: 200, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Heading size="sm" mt={3}>Emoji Info</Heading>
                <Box fontSize="sm" color="gray.600">
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

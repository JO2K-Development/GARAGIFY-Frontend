"use client";
import { Modal, Form, InputNumber, Button, Slider } from "antd";
import { ParkingLine } from "../utils/types";

interface ParkingLineConfigModalProps {
  selectedLineId: string | null;
  setSelectedLineId: (id: string | null) => void;
  lines: ParkingLine[];
  updateLine: (id: string, updates: Partial<ParkingLine>) => void;
  deleteLine: (id: string) => void;
}

const ParkingLineConfigModal = ({
  selectedLineId,
  lines,
  updateLine,
  deleteLine,
  setSelectedLineId,
}: ParkingLineConfigModalProps) => {
  const selectedLine = lines.find((line) => line.id === selectedLineId);

  return (
    <Modal
      open={!!selectedLineId}
      title={`Config for ${selectedLineId}`}
      onCancel={() => setSelectedLineId(null)}
      footer={[
        <Button key="delete" danger onClick={() => deleteLine(selectedLineId!)}>
          Delete Line
        </Button>,
        <Button key="close" onClick={() => setSelectedLineId(null)}>
          Close
        </Button>,
      ]}
    >
      {selectedLine && (
        <Form layout="vertical">
          <Form.Item label="Spots">
            <InputNumber
              value={selectedLine.spotsCount}
              onChange={(v) => {
                if (v) updateLine(selectedLine.id, { spotsCount: v });
              }}
            />
          </Form.Item>
          <Form.Item label="Width">
            <InputNumber
              value={selectedLine.width}
              onChange={(v) => {
                if (v) updateLine(selectedLine.id, { width: v });
              }}
            />
          </Form.Item>
          <Form.Item label="Height">
            <InputNumber
              value={selectedLine.height}
              onChange={(v) => {
                if (v) updateLine(selectedLine.id, { height: v });
              }}
            />
          </Form.Item>
          <Form.Item label="Angle">
            <Slider
              min={0}
              max={180}
              step={1}
              value={selectedLine.rotation}
              onChange={(v) => updateLine(selectedLine.id, { rotation: v })}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ParkingLineConfigModal;

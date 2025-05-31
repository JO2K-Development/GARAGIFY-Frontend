import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import ParkingLendForm from "../ParkingLendForm/ParkingLendForm";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";
import { Card } from 'antd';
const LendingView = () => {
  return (
<Card style={{ 
    //   display: 'inline-flex', // Makes width fit content
    width: '70%',
      padding: 24,
    }}>
    <ParkingLendForm />
</Card>)

};
export default LendingView;

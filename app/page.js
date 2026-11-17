import BootScreen from '../components/boot/BootScreen';
import Desktop from '../components/desktop/Desktop';
import MlhBadge from '../components/MlhBadge';

export default function Home() {
  return (
    <>
      <Desktop />
      <BootScreen />
      <MlhBadge />
    </>
  );
}

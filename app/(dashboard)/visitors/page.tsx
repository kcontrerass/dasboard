import { getVisitors } from '../../lib/actions';
import VisitorsContent from './content';

export default async function VisitorsPage() {
    const { data: visitors } = await getVisitors();

    return <VisitorsContent visitors={visitors} />;
}

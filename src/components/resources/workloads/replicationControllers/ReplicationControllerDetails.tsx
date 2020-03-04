import {
  IonChip,
  IonGrid, IonLabel,
  IonRow,
} from '@ionic/react';
import { V1ReplicationController } from '@kubernetes/client-node'
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { labelSelector } from '../../../../utils/helpers';
import List from '../../misc/List';
import PodTemplate from '../../misc/podTemplate/PodTemplate';
import Conditions from '../../misc/template/Conditions';
import Configuration from '../../misc/template/Configuration';
import Metadata from '../../misc/template/Metadata';
import Row from '../../misc/template/Row';
import Status from '../../misc/template/Status';

interface IReplicationControllerDetailsProps extends RouteComponentProps {
  item: V1ReplicationController;
  section: string;
  type: string;
}

const ReplicationControllerDetails: React.FunctionComponent<IReplicationControllerDetailsProps> = ({ item, type }) => {
  return (
    <IonGrid>
      <IonRow>
        <Configuration>
          <Row
            obj={item}
            objKey="spec.selector.matchLabels"
            title="Selectors"
            value={(value) => Object.keys(value).map((label) => {
              return (
                <IonChip key={label} className="unset-chip-height">
                  <IonLabel>{label}: {value[label]}</IonLabel>
                </IonChip>
              )
            })}
          />
          <Row obj={item} objKey="spec.minReadySeconds" title="Min Ready Seconds" />
          <Row obj={item} objKey="spec.replicas" title="Replicas" />
        </Configuration>

        <Status>
          <Row obj={item} objKey="status.replicas" title="Current Replicas" />
          <Row obj={item} objKey="status.readyReplicas" title="Ready Replicas" />
          <Row obj={item} objKey="status.availableReplicas" title="Available Replicas" />
          <Row obj={item} objKey="status.fullyLabeledReplicas" title="Fully Labeled Replicas" />
          <Row obj={item} objKey="status.observedGeneration" title="Observed Generation" />
        </Status>
      </IonRow>

      {item.metadata ?  <Metadata metadata={item.metadata} type={type} /> : null}

      {item.status && item.status.conditions ? (
        <IonRow>
          <Conditions conditions={item.status.conditions} />
        </IonRow>
      ) : null}

      {item.metadata && item.metadata.namespace && item.spec && item.spec.selector ? (
        <IonRow>
          <List name="Pods" section="workloads" type="pods" namespace={item.metadata.namespace} selector={`labelSelector=${labelSelector(item.spec.selector)}`} />
        </IonRow>
      ) : null}

      {item.metadata && item.metadata.name && item.metadata.namespace ? (
        <IonRow>
          <List name="Events" section="cluster" type="events" namespace={item.metadata.namespace} selector={`fieldSelector=involvedObject.name=${item.metadata.name}`} />
        </IonRow>
      ) : null}

      {item.spec && item.spec.template ? <PodTemplate template={item.spec.template} /> : null}
    </IonGrid>
  )
};

export default ReplicationControllerDetails;

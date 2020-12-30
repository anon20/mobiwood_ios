import React from 'react'
import {View,Text} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters';
import Unorderedlist from 'react-native-unordered-list';
import {Colors, Typography} from '../constants';

export default function TNC(){
    return(
<View>
  <View>
    <Text style={styles.listHeading}>Rules for the video</Text>
    <Unorderedlist>
      <Text style={styles.listItem}>The video can be of a maximum duration of 90 seconds</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}> The video must have original content and must not include any copy-write content</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>The video must be self-shot or indicate the participant’s presence</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>The video must be centered only on humans and any
        other living or non-living thing can just be used
        as supporting assets </Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>Previously shot videos can be used after removing
        any other platform’s watermark (if exists)</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>Any harm to animals is strictly prohibited</Text>
    </Unorderedlist>
  </View>
  <View>
    <Text style={styles.listHeading}>Rules for the contest</Text>
    <Unorderedlist>
      <Text style={styles.listItem}>By entering the competition entrants warrant that
        all information submitted by them is true,
        current, and complete.</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>Multiple entries from a single participant are
        allowed for each round 80% of participants from a
        particular round will go to the further rounds</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>Only G-rated content is allowed (R rated content
        is strictly prohibited)</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>Participants under 18 years of age must fill this
        parent consent form </Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>All rights are reserved by the T&C of WTL and
        any breach of the above rules will result in the
        debarment of the participant from the contest</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>Entries submitted through agents or third parties
        or in bulk (i.e. more entries than a human being
        could submit in the time available without the use
        of software or other devices designed to make
        automated entries or, in the case of postal
        entries, more than one entry submitted under the
        same postage stamp) will not be accepted.</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>Mobiwood holds all the rights for changing the
        rules, rejecting the videos or disqualifying any
        participants</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>The participants will be informed via email for the same.</Text>
    </Unorderedlist>
    <Unorderedlist>
      <Text style={styles.listItem}>All rights reserved with Mobiwood.</Text>
    </Unorderedlist>
  </View>
</View>
)
}

const styles = ScaledSheet.create({
    listHeading:{
       fontWeight:'bold',
        fontSize:"18@ms",
        color:"gray",
        marginTop:"10@ms",
        marginBottom:"10@ms"
      },
      listItem:{
        marginBottom:"8@ms",
        fontSize:"14@ms",
        lineHeight:"20@ms",
        textAlign: "justify",
        paddingRight: "10@ms",
      },
})

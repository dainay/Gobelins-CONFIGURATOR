import React from 'react'

import { GuildsInfo } from '../../constants/GuildsInfo';

import { View, Text } from 'react-native';
import ThemedButton from '../../components/ui/ThemedButton';

function GuildChoice() {

const randomGuild = GuildsInfo.guilds[Math.floor(Math.random() * GuildsInfo.guilds.length)];    

  return (
    <>
    <View>
      <Text>Are you ready to discover your guild?</Text>

      <Text>YYour guild is like your little gobelin family: the more you help others, the more points your guild wins</Text>
    </View>
    <View>

       < ThemedButton onPress={() => {
          console.log(`You have chosen the guild: ${randomGuild.name}`);
        }}>
          
        </ThemedButton>

    </View>
    </>
  )
}

export default GuildChoice
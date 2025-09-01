import { Image, Switch, Text, TextInput, View } from 'react-native'
import EditIcon from '../../../assets/icons/EditIcon'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '../../../services/getCurrentUser';
import GenericButton from '../../../components/GenericButton';
const newExcercise = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLbs, setIsLbs] = useState(true);
  const [weightBased, setWeightBased] = useState(true);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      setIsLbs(currentUser?.weightType === "LBS");
    })();
  }, []);

  return (
    <View className="flex-1">
        <View>
            <Image source={imageUri ? { uri: imageUri } : require('../../../assets/images/exercise example.png')} className="w-full h-40 opacity-50" />
            <View className="flex-row items-center justify-between absolute bottom-4 right-4">
                <EditIcon height={25} width={25} fill="white" />
            </View>
        </View>
        <View className="px-4">
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Exercise Name</Text>
                <TextInput placeholder="ex. Lat pull down" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
            </View>
        </View>
        <View className="px-4">
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Rest Time</Text>
                <View className="flex-row gap-2 items-center">
                    <TextInput placeholder="0" keyboardType="numeric" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                    <Text className='text-white text-lg font-[HelveticaNeue]'>secs</Text>
                </View>
            </View>
        </View>
        <View className="px-4">
            <View className="flex-row gap-6 mt-4">
                <View className="flex-col gap-2">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Sets</Text>
                    <TextInput placeholder="0" keyboardType="numeric" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
                <View className="flex-col gap-2">
                    <Text className='text-white text-lg font-[HelveticaNeue]'>Reps</Text>
                    <TextInput placeholder="0" keyboardType="numeric" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                </View>
            </View>
        </View>
        <View className="flex-row items-center justify-between px-4 mt-6 mb-4">
            <Text className='text-white text-lg font-[HelveticaNeue]'>Weight Based</Text>
            <Switch thumbColor='white' trackColor={{ true: '#F43A45', false: '#27272A' }} value={weightBased} onValueChange={() => {setWeightBased(!weightBased)}} />
        </View>
        {weightBased && <View className="px-4">
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Weight</Text>
                <View className="flex-row gap-2 items-center">
                    <TextInput placeholder="0" keyboardType="numeric" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                    <Text className='text-white text-lg font-[HelveticaNeue]'>{isLbs ? 'lbs' : 'kgs'}</Text>
                </View>
            </View>
        </View>}

        {!weightBased && <View className="px-4">
            <View className="flex-col gap-2 mt-4">
                <Text className='text-white text-lg font-[HelveticaNeue]'>Time</Text>
                <View className="flex-row gap-2 items-center">
                    <TextInput placeholder="0" keyboardType="numeric" placeholderTextColor="#828282" className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3" />
                    <Text className='text-white text-lg font-[HelveticaNeue]'>secs</Text>
                </View>
            </View>
        </View>}

        <GenericButton text="Save Exercise" onPress={async () => {}} className="self-center absolute bottom-20" textClassName="text-lg" />
    </View>
  )
}
export default newExcercise
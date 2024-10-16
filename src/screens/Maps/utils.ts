import AdmFirstFloor from '@/assets/maps/projeto_detalhado_administracao_1andar.jpg'
import AdmGround from '@/assets/maps/projeto_detalhado_administracao_terreo.jpg'
import BienioFirstFloor from '@/assets/maps/projeto_detalhado_bienio_1andar.jpg'
import BienioSecondFloor from '@/assets/maps/projeto_detalhado_bienio_2andar.jpg'
import BienioGround from '@/assets/maps/projeto_detalhado_bienio_terreo.jpg'
import CivilFirstFloor from '@/assets/maps/projeto_detalhado_civil_1andar.jpg'
import CivilGround from '@/assets/maps/projeto_detalhado_civil_terreo.jpg'
import EletricaFirstFloor from '@/assets/maps/projeto_detalhado_eletrica_1andar.jpg'
import EletricaSecondFloor from '@/assets/maps/projeto_detalhado_eletrica_2andar.jpg'
import EletricaThirdFloor from '@/assets/maps/projeto_detalhado_eletrica_3andar.jpg'
import EletricaGround from '@/assets/maps/projeto_detalhado_eletrica_terreo.jpg'
import MecanicaFirstFloor from '@/assets/maps/projeto_detalhado_mecanica_1andar.jpg'
import MecanicaGround from '@/assets/maps/projeto_detalhado_mecanica_terreo.jpg'
import MetalurgicaFirstFloor from '@/assets/maps/projeto_detalhado_metalurgica_1andar.jpg'
import MetalurgicaGround from '@/assets/maps/projeto_detalhado_metalurgica_terreo.jpg'
import ProducaoFirstFloor from '@/assets/maps/projeto_detalhado_producao_1andar.jpg'
import ProducaoGround from '@/assets/maps/projeto_detalhado_producao_terreo.jpg'

import { Building } from '@/dtos/classes'
import { ImageSourcePropType } from 'react-native'

type BuildingMaps = {
  height: number
  images: Record<string, ImageSourcePropType>
}

export const mapsImagePathTable: Record<Building, BuildingMaps> = {
  Administração: {
    height: 280,
    images: {
      0: AdmGround,
      1: AdmFirstFloor,
    },
  },
  Biênio: {
    height: 280,
    images: {
      0: BienioGround,
      1: BienioFirstFloor,
      2: BienioSecondFloor,
    },
  },
  Civil: {
    height: 240,
    images: {
      0: CivilGround,
      1: CivilFirstFloor,
    },
  },
  Elétrica: {
    height: 280,
    images: {
      0: EletricaGround,
      1: EletricaFirstFloor,
      2: EletricaSecondFloor,
      3: EletricaThirdFloor,
    },
  },
  Mecânica: {
    height: 280,
    images: {
      0: MecanicaGround,
      1: MecanicaFirstFloor,
    },
  },
  Metalúrgica: {
    height: 200,
    images: {
      0: MetalurgicaGround,
      1: MetalurgicaFirstFloor,
    },
  },
  Produção: {
    height: 280,
    images: {
      0: ProducaoGround,
      1: ProducaoFirstFloor,
    },
  },
}

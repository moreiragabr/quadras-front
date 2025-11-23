import { Component, inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { QuadraService } from '../../core/service/quadraService/quadra-service';
import { Quadra } from '../../core/models/quadra';
import { Router, RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss'],
})
export class Mapa implements OnInit {

  quadraService = inject(QuadraService);
  router = inject(Router); // 2. Injeta o Router
  quadras!: Quadra[];
  private mapa!: L.Map;
  private centroid: L.LatLngExpression = [-25.546944, -54.586389]; // Foz do Iguaçu
  private userMarker: L.Marker | null = null;


  private initMap(): void {

    // Configuração dos ícones (necessário para que os marcadores padrão funcionem)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });

    this.mapa = L.map('map', {
      center: this.centroid,
      zoom: 12,
      zoomControl: false
    });

    // Adiciona controle de zoom
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.mapa);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.mapa);

    this.adicionarBotaoLocalizacao();

    setTimeout(() => {
      this.mapa.invalidateSize();
    }, 100);
  }


  private adicionarQuadrasNoMapa(quadras: Quadra[]): void {
    if (!this.mapa) {
      console.error('O mapa não foi inicializado.');
      return;
    }

    // Cria um ícone personalizado para as quadras (opcional, mas recomendado para diferenciar)
    const courtIcon = L.icon({
      iconUrl: 'assets/images/icons/location-icon.png', // Exemplo de ícone de quadra
      iconSize: [32, 32],      // tamanho do ícone
      iconAnchor: [16, 32],    // ponto de âncora do ícone
      popupAnchor: [0, -32]  // ponto onde o popup deve abrir
    });

    quadras.forEach(quadra => {
      const { lat, lot, nome, rua, numeroCasa, bairro, valorHora, tipoQuadra } = quadra;


      const latitude = Number(lat);
      const longitude = Number(lot);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error(`Coordenadas inválidas para a quadra: ${nome}`);
        return;
      }
      // Cria o conteúdo HTML do popup
      const popupContent = `
        <div class="popup-quadra centralizar-text">
          <p class="fonte-3 cor font-size-25 margin-0">${nome}</p>
          <p class="fonte-2 cor font-size-18 margin-0 custom-p">${tipoQuadra}</p>
          <p class="fonte-2 cor font-size-15 margin-0 custom-p">${rua} - ${numeroCasa}</p>
          <p class="fonte-2 cor font-size-15 margin-0">Valor-hora médio: R$ ${valorHora ? valorHora.toFixed(2) : 'N/A'}</p>
          <button id="detalhe-quadra-${quadra.id}" class="popup-link-detalhes fonte-3 cor font-size-17 margin-0 custom-b">Ver detalhes</button>
        </div>
      `;

      // Cria o marcador e o adiciona ao mapa
      const marker = L.marker([latitude, longitude], { icon: courtIcon })
        .addTo(this.mapa)
        .bindPopup(popupContent, {
          maxWidth: 300,
          closeButton: false
        });

      marker.on('popupopen', () => {
        // Encontra o botão pelo ID único dentro do popup
        const detailsButton = document.getElementById(`detalhe-quadra-${quadra.id}`);

        if (detailsButton) {
          // Usa o DomEvent do Leaflet para adicionar um listener de clique
          L.DomEvent.on(detailsButton, 'click', (e) => {
            // Previne a propagação do evento (para não fechar o popup inesperadamente)
            L.DomEvent.stopPropagation(e);

            // Navegação programática do Angular
            this.router.navigate(['/quadras', quadra.id]);

            // Opcional: fechar o popup após o clique
            this.mapa.closePopup();
          });
        }
      });
    });
  }

  verInformacoes(quadraId: number): void {
    this.router.navigate(['/quadras', quadraId]);
  }

  private adicionarBotaoLocalizacao(): void {

    const botaoLocalizacao = (L.control as any)({ position: 'bottomleft' });

    botaoLocalizacao.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar botao-localizacao'); // Usando leaflet-bar para estilo padrão
      div.innerHTML = `
        <button class="btn-localizacao" title="Minha Localização">
          📍
        </button>
      `;

      L.DomEvent.on(div, 'click', (e) => {
        L.DomEvent.stopPropagation(e);
        this.irParaMinhaLocalizacao();
      });

      return div;
    };

    botaoLocalizacao.addTo(this.mapa);
  }

  private irParaMinhaLocalizacao(): void {
    if (!navigator.geolocation) {
      console.error('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    // Mostra loading no botão
    const botao = document.querySelector('.btn-localizacao') as HTMLElement;
    if (botao) botao.innerHTML = '⏳';

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        // Sucesso - obtém coordenadas
        const userCoords: L.LatLngExpression = [
          posicao.coords.latitude,
          posicao.coords.longitude
        ];

        // Move o mapa para a localização do usuário
        this.mapa.setView(userCoords, 15);

        // Remove marcador anterior se existir
        if (this.userMarker) {
          this.mapa.removeLayer(this.userMarker);
        }

        // Adiciona novo marcador na localização do usuário
        this.userMarker = L.marker(userCoords)
          .addTo(this.mapa)
          .bindPopup('Você está aqui!')
          .openPopup();

        // Adiciona círculo de precisão
        L.circle(userCoords, {
          color: 'blue',
          fillColor: '#1e90ff',
          fillOpacity: 0.2,
          radius: posicao.coords.accuracy
        }).addTo(this.mapa);

        // Restaura ícone do botão
        if (botao) botao.innerHTML = '📍';

      },
      (erro) => {
        // Erro na geolocalização
        console.error('Erro na geolocalização:', erro);

        // Restaura ícone do botão
        if (botao) botao.innerHTML = '📍';

        let mensagem = 'Não foi possível obter sua localização. ';

        switch (erro.code) {
          case erro.PERMISSION_DENIED:
            mensagem += 'Permissão negada pelo usuário.';
            break;
          case erro.POSITION_UNAVAILABLE:
            mensagem += 'Localização indisponível.';
            break;
          case erro.TIMEOUT:
            mensagem += 'Tempo de busca pela localização esgotado.';
            break;
          default:
            mensagem += 'Erro desconhecido.';
        }

        // Substituindo 'alert' conforme a regra. Em um app real, use um serviço de notificação.
        // alert(mensagem); 
        console.error(mensagem); // Apenas logando o erro
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  }

  /**
   * Localização automática ao iniciar
   */
  private localizacaoAutomatica(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const userCoords: L.LatLngExpression = [
            posicao.coords.latitude,
            posicao.coords.longitude
          ];
          this.mapa.setView(userCoords, 13);
        },
        (erro) => {
          console.log('Localização automática falhou, usando Foz do Iguaçu');
        }
      );
    }
  }

  ngOnInit(): void {
    this.initMap();

    this.quadraService.findAll().subscribe({
      next: (dados) => {
        this.quadras = dados;
        this.adicionarQuadrasNoMapa(this.quadras);
      },
      error: (erro) => {
        console.error('Erro ao carregar os dados:', erro);
      }
    })


    setTimeout(() => this.localizacaoAutomatica(), 2000);
  }
}
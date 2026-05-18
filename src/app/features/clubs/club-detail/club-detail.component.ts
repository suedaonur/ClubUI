import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClubService, Club } from '../../../core/services/club.service';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './club-detail.component.html',
  styleUrl: './club-detail.component.css'
})
export class ClubDetailComponent implements OnInit {
  club: Club | null = null;
  isLoading: boolean = true;
  isJoining: boolean = false;
  isMember: boolean = false;
  isAdminUser: boolean = false;
  
  // Facebook tarzı gönderi paylaşma alanları
  hasPostPermission: boolean = false;
  newPost = { title: '', content: '' };
  isSubmittingPost: boolean = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clubService = inject(ClubService);
  private authService = inject(AuthService);
  private postService = inject(PostService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchClubDetails(id);
    }
  }

  fetchClubDetails(id: number) {
    this.clubService.getClubById(id).subscribe({
      next: (data) => {
        this.club = data;

        // Gönderileri en yeni tarih en üstte olacak şekilde sırala
        if (this.club && this.club.posts) {
          this.club.posts.sort((a, b) => new Date(b.createdDate || b.CreatedDate || 0).getTime() - new Date(a.createdDate || a.CreatedDate || 0).getTime());
        }

        this.isLoading = false;

        // Giriş yapmış kullanıcının üyelik durumunu ve paylaşım yetkisini denetle
        const user = this.authService.currentUser();
        if (user && this.club && this.club.members) {
          const member = this.club.members.find(m => m.studentId === user.id && !m.isDeleted);
          this.isMember = !!member;
          this.isAdminUser = !!member?.isAdmin;
          this.hasPostPermission = !!(member?.isAdmin || member?.isWriteable);
        } else {
          this.isMember = false;
          this.isAdminUser = false;
          this.hasPostPermission = false;
        }
      },
      error: (err) => {
        console.error("Detaylar çekilemedi", err);
        this.isLoading = false;
      }
    });
  }

  onSubmitPost() {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      alert("Lütfen gönderi başlığını ve içeriğini girin!");
      return;
    }

    const user = this.authService.currentUser();
    if (!user || !this.club) return;

    this.isSubmittingPost = true;
    const payload = {
      clubId: this.club.id,
      title: this.newPost.title.trim(),
      content: this.newPost.content.trim(),
      studentId: user.id
    };

    this.postService.createPost(payload).subscribe({
      next: () => {
        alert("Gönderi kulüp sayfasında başarıyla paylaşıldı! 🚀");
        this.newPost = { title: '', content: '' };
        this.isSubmittingPost = false;
        this.fetchClubDetails(this.club!.id); // Postları yenilemek için kulüp detayını tekrar yükle
      },
      error: (err) => {
        console.error("Gönderi paylaşılamadı", err);
        alert("Gönderi paylaşılırken bir hata oluştu.");
        this.isSubmittingPost = false;
      }
    });
  }

  onDeletePost(postId: number) {
    if (confirm("Bu gönderiyi silmek istediğinizden emin misiniz?")) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          alert("Gönderi başarıyla silindi! 🗑️");
          if (this.club) {
            this.fetchClubDetails(this.club.id);
          }
        },
        error: (err) => {
          console.error("Gönderi silinirken hata oluştu", err);
          alert("Gönderi silinirken bir hata oluştu.");
        }
      });
    }
  }

  onLikePost(postId: number) {
    const user = this.authService.currentUser();
    if (!user) {
      alert("Gönderiyi beğenmek için lütfen önce giriş yapın!");
      this.router.navigate(['/login']);
      return;
    }

    this.postService.likePost(postId, user.id!).subscribe({
      next: () => {
        if (this.club) {
          this.fetchClubDetails(this.club.id);
        }
      },
      error: (err) => {
        console.error("Beğeni eklenemedi", err);
        alert("Bu gönderiyi zaten beğenmiş olabilirsiniz.");
      }
    });
  }

  onCommentPlaceholder() {
    alert("Yorum yapma özelliği çok yakında sizlerle! 💬");
  }

  onJoin() {
    const user = this.authService.currentUser();
    if (!user) {
      alert("Lütfen önce giriş yapın!");
      this.router.navigate(['/login']);
      return;
    }

    if (this.club) {
      this.isJoining = true;
      this.clubService.joinClub(user.id!, this.club.id).subscribe({
        next: () => {
          alert(`Tebrikler! ${this.club?.name} kulübüne başarıyla katıldın.`);
          this.isJoining = false;
          this.router.navigate(['/my-clubs']); // Kulüplerim sayfasına yönlendir
        },
        error: (err) => {
          alert("Bir hata oluştu veya zaten bu kulübe üyesiniz.");
          this.isJoining = false;
        }
      });
    }
  }
}